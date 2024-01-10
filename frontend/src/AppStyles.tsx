import styled from "styled-components";

type ThemedProps = {
    theme: Theme;
    $contentMargin?: number;
};

export const AppStyles = {
    // Themed Components
    ThemedContent: styled.div<ThemedProps>`
        background-color: ${props => props.theme.background};
        color: ${props => props.theme.text};
        margin-left: ${props => props.$contentMargin}px;
    `,

    ThemedInput: styled.input<ThemedProps>`
        background-color: ${props => props.theme.input};
        color: ${props => props.theme.text};
        &::placeholder {
            color: ${props => props.theme.textSecondary};
        }
        &:disabled {
            background-color: ${props => props.theme.inputDisabled};
            color: ${props => props.theme.textSecondary};
        }
        &:focus {
            background-color: ${props => props.theme.input};
            color: ${props => props.theme.text};
        }
    `,

    ThemedSelect: styled.select<ThemedProps>`
        background-color: ${props => props.theme.input};
        color: ${props => props.theme.text};
        &::placeholder {
            color: ${props => props.theme.textSecondary};
        }
        &:disabled {
            background-color: ${props => props.theme.inputDisabled};
            color: ${props => props.theme.textSecondary};
        }
        &:focus {
            background-color: ${props => props.theme.input};
            color: ${props => props.theme.text};
        }
    `,

    ThemedFileUploadList: styled.li<ThemedProps>`
        background-color: ${props => props.theme.background};
        color: ${props => props.theme.text};
    `,

    ThemedLink: styled.a<ThemedProps>`
        color: ${props => props.theme.link};
        &:hover {
            color: ${props => props.theme.linkHover};
        }
    `,

    ThemedButton: styled.a<ThemedProps>`
        background-color: ${props => props.theme.buttonBackground};
        color: ${props => props.theme.buttonText};
        &:hover {
            background-color: ${props => props.theme.buttonBackgroundHover};
            color: ${props => props.theme.buttonTextHover};
        }
    `,

    ThemedButtonOutline: styled.button<ThemedProps>`
        background-color: ${props => props.theme.buttonOutlineBackground};
        border: 1px solid ${props => props.theme.buttonOutlineBorder};
        color: ${props => props.theme.buttonOutlineText};
        &:hover {
            background-color: ${props => props.theme.buttonOutlineBackgroundHover};
            color: ${props => props.theme.buttonOutlineTextHover};
        }
    `,

    ThemedButtonSecondary: styled.button<ThemedProps>`
        background-color: ${props => props.theme.buttonSecondaryBackground};
        color: ${props => props.theme.buttonSecondaryText};
        &:hover {
            background-color: ${props => props.theme.buttonSecondaryBackgroundHover};
            color: ${props => props.theme.buttonSecondaryTextHover};
        }
    `,

    ThemedButtonSecondaryOutline: styled.button<ThemedProps>`
        background-color: ${props => props.theme.buttonSecondaryOutlineBackground};
        border: 1px solid ${props => props.theme.buttonSecondaryOutlineBorder};
        color: ${props => props.theme.buttonSecondaryOutlineText};
        &:hover {
            background-color: ${props => props.theme.buttonSecondaryOutlineBackgroundHover};
            color: ${props => props.theme.buttonSecondaryOutlineTextHover};
        }
    `,

    ThemedCloseButton: styled.button<ThemedProps>`
        filter: ${props => props.theme.closeBtn};
    `,

    // Themed Widgets: Dockets
    ThemedDocketCard: styled.div<ThemedProps>`
        background-color: ${props => props.theme.docketCardBackground};
        border: 1px solid ${props => props.theme.docketCardBorder};
    `,

    // Themed Widgets: Modals
    ThemedModalHeader: styled.div<ThemedProps>`
        background-color: ${props => props.theme.backgroundSecondary};
        border-bottom: 1px solid ${props => props.theme.border};
        color: ${props => props.theme.text};
    `,

    ThemedModalBody: styled.div<ThemedProps>`
        background-color: ${props => props.theme.background};
        color: ${props => props.theme.text};
    `,

    ThemedModalBodyConsecutive: styled.div<ThemedProps>`
        background-color: ${props => props.theme.background};
        border-top: 1px solid ${props => props.theme.border};
        color: ${props => props.theme.text};
    `,

    ThemedModalFooter: styled.div<ThemedProps>`
        background-color: ${props => props.theme.background};
        border-top: 1px solid ${props => props.theme.border};
        color: ${props => props.theme.text};
    `,

    // Themed Widgets: Sidebar
    ThemedSidebar: styled.nav<ThemedProps>`
        background-color: ${props => props.theme.sidebarBackground};
    `,

    ThemedSidebarLink: styled.a<ThemedProps>`
        color:  ${props => props.theme.sidebarLink};
        &:hover {
            color:  ${props => props.theme.sidebarLinkHover};
        }
    `,

    // Themed Widgets: Asset Browser
    ThemedAssetContainer: styled.div<ThemedProps>`
        background-color: ${props => props.theme.background};
        border: 1px solid ${props => props.theme.border};
    `,
    
    // Themed Widgets: Icon Browser
    ThemedBrowserIconsDropdown: styled.div<ThemedProps>`
        background-color: ${props => props.theme.background};
        border: 1px solid ${props => props.theme.border};
    `,
    
    // Themed Views: Dashboard
    ThemedDashboardGalleryCard: styled.div<ThemedProps>`
        color: ${props => props.theme.text};
    `,

    ThemedDashboardGalleryCardBody: styled.div<ThemedProps>`
        background-color: ${props => props.theme.background};
    `,

    // Themed Views: Home
    ThemedHomeGalleryAllTopics: styled.div<ThemedProps>`
        background-color: ${props => props.theme.cardAllTopicsBackground};
        border: 1px solid ${props => props.theme.cardAllTopicsBorder};
    `,

    ThemedHomeGalleryAllTopicsCard: styled.div<ThemedProps>`
        background-color: ${props => props.theme.docketCardBackground};
        border: 1px solid ${props => props.theme.docketCardBorder};
        &:hover {
            background-color: ${props => props.theme.buttonSecondaryBackgroundHover};
            color:  ${props => props.theme.buttonSecondaryTextHover};
        }
    `,

    // Themed Views: Topic
    ThemedTopicContainer: styled.div<ThemedProps>`
        background-color: ${props => props.theme.background};
        border: 1px solid ${props => props.theme.border};
    `,
};
