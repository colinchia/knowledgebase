package me.colinchia.knowledgebase.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class SpaController {
    @RequestMapping(value = "/{path:[^\\.]*}")
    public RedirectView redirect(HttpServletRequest request) {
        return new RedirectView("/");
    }
}
