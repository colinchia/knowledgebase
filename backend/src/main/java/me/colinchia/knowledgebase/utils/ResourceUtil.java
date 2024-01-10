package me.colinchia.knowledgebase.utils;

import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class ResourceUtil {
    private final Path resourcesDir = Paths.get("../resources"); // Relative to the Spring Boot project's root

    public Path getResourcesDir() {
        return resourcesDir;
    }

    public Path resolveUniqueFilename(Path directory, String originalFilename) throws IOException {
        Path filepath = directory.resolve(originalFilename);

        String nameWithoutExtension = originalFilename.substring(0, originalFilename.lastIndexOf('.'));
        String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));

        // Rename duplicate filenames (append current timestamp)
        while (Files.exists(filepath)) {
            filepath = resourcesDir.resolve("assets").resolve(nameWithoutExtension + "_" + System.currentTimeMillis() + extension);
        }

        return filepath;
    }

    public void processAndSavePortrait(MultipartFile portrait, Path portraitPath) throws Exception {
        BufferedImage originalImage = ImageIO.read(portrait.getInputStream());
        BufferedImage processedImage = originalImage;

        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();
        int targetSize = 450;

        // Scale up if image is smaller than 450x450
        if (originalWidth < targetSize || originalHeight < targetSize) {
            double scaleFactor = Math.max((double) targetSize / originalWidth, (double) targetSize / originalHeight);
            int scaledWidth = (int) (originalWidth * scaleFactor);
            int scaledHeight = (int) (originalHeight * scaleFactor);
            BufferedImage scaledImage = new BufferedImage(scaledWidth, scaledHeight, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2dScaled = scaledImage.createGraphics();
            g2dScaled.drawImage(originalImage.getScaledInstance(scaledWidth, scaledHeight, Image.SCALE_SMOOTH), 0, 0, null);
            g2dScaled.dispose();
            processedImage = scaledImage;
        }

        // Perform centered cropping
        if (processedImage.getWidth() > targetSize || processedImage.getHeight() > targetSize) {
            int startX = (processedImage.getWidth() - targetSize) / 2;
            int startY = (processedImage.getHeight() - targetSize) / 2;
            BufferedImage croppedImage = processedImage.getSubimage(startX, startY, targetSize, targetSize);
            processedImage = croppedImage;
        }

        ImageIO.write(processedImage, "jpg", Files.newOutputStream(portraitPath));
    }

    public String createThumbnail(String filenameWithTimestamp, MultipartFile file) throws Exception {
        String filename = filenameWithTimestamp.substring(0, filenameWithTimestamp.lastIndexOf('.'));
        String filetype = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.') + 1).toLowerCase();
        Path thumbnailSource = resourcesDir.resolve("thumbnail-source");
        Path thumbnailPath = resourcesDir.resolve("thumbnails");

        switch (filetype) {
            case "gif":
            case "jpeg":
            case "jpg":
            case "png":
            case "webp":
                return createThumbnailForImage(file, filename);
            case "avi":
            case "mov":
            case "mp4":
            case "wmv":
                return createThumbnailForVideo(file, filename);
            case "mp3":
            case "mpeg":
            case "wav":
                thumbnailSource = thumbnailSource.resolve("thumbnail-source-audio.jpg");
                break;
            case "pdf":
            case "doc":
            case "docx":
            case "xls":
            case "xlsx":
            case "ppt":
            case "pptx":
            case "txt":
                thumbnailSource = thumbnailSource.resolve("thumbnail-source-document.jpg");
                break;
            default:
                thumbnailSource = thumbnailSource.resolve("thumbnail-source-misc.jpg");
        }

        BufferedImage originalIcon = ImageIO.read(thumbnailSource.toFile());
        Path thumbnailFilePath = thumbnailPath.resolve(filename + "_thumbnail.jpg");
        if (Files.exists(thumbnailFilePath)) {
            throw new FileAlreadyExistsException("Thumbnail already exists");
        }
        ImageIO.write(originalIcon, "jpg", Files.newOutputStream(thumbnailFilePath));
        return thumbnailFilePath.toString();
    }

    private String createThumbnailForImage(MultipartFile file, String filename) throws Exception {
        Path thumbnailFilePath = resourcesDir.resolve("thumbnails").resolve(filename + "_thumbnail.jpg");

        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        BufferedImage thumbnailImage = new BufferedImage(450, 450, BufferedImage.TYPE_INT_RGB);
        thumbnailImage.createGraphics().drawImage(originalImage.getScaledInstance(450, 450, Image.SCALE_SMOOTH), 0, 0, null);

        ImageIO.write(thumbnailImage, "jpg", Files.newOutputStream(thumbnailFilePath));
        return thumbnailFilePath.toString();
    }

    private String createThumbnailForVideo(MultipartFile file, String filename) throws Exception {
        Path thumbnailFilePath = resourcesDir.resolve("thumbnails").resolve(filename + "_thumbnail.jpg");

        FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(file.getInputStream());
        grabber.start();

        int lengthInSeconds = (int) grabber.getLengthInTime() / 1000000; // Convert microseconds to seconds
        int frameRate = (int) grabber.getFrameRate();

        if (lengthInSeconds >= 3) {
            int frameNumber = 3 * frameRate;
            grabber.setFrameNumber(frameNumber);
        }

        Frame frame;
        do {
            frame = grabber.grabImage();
        } while (frame == null); // Skip any non-image frames

        Java2DFrameConverter converter = new Java2DFrameConverter();
        BufferedImage bufferedImage = converter.getBufferedImage(frame);

        ImageIO.write(bufferedImage, "jpg", Files.newOutputStream(thumbnailFilePath));
        grabber.stop();

        return thumbnailFilePath.toString();
    }
}
