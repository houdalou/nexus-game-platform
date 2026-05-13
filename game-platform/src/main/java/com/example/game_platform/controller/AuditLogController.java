package com.example.game_platform.controller;

import com.example.game_platform.entity.AuditLog;
import com.example.game_platform.service.AuditLogService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit")
@PreAuthorize("hasRole('ADMIN')")
public class AuditLogController {

    private final AuditLogService auditLogService;

    // Constructor to inject AuditLogService dependency
    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    // Get all audit logs
    @GetMapping
    public List<AuditLog> getAllLogs() {
        return auditLogService.getAllLogs();
    }

    // Get audit logs from recent days
    @GetMapping("/recent/{days}")
    public List<AuditLog> getRecentLogs(@PathVariable int days) {
        return auditLogService.getRecentLogs(days);
    }

    // Get audit logs by admin username
    @GetMapping("/admin/{username}")
    public List<AuditLog> getLogsByAdmin(@PathVariable String username) {
        return auditLogService.getLogsByAdmin(username);
    }

    // Get audit logs by action type
    @GetMapping("/action/{action}")
    public List<AuditLog> getLogsByAction(@PathVariable String action) {
        return auditLogService.getLogsByAction(action);
    }
}
