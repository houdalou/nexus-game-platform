package com.example.game_platform.service;

import com.example.game_platform.entity.AuditLog;
import com.example.game_platform.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    // Constructor to inject dependency
    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    // Log an admin action to the audit trail
    public AuditLog logAction(String adminUsername, String action, String target, String details) {
        AuditLog log = AuditLog.builder()
                .adminUsername(adminUsername)
                .action(action)
                .target(target)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();
        return auditLogRepository.save(log);
    }

    // Get all audit logs sorted by timestamp
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findByOrderByTimestampDesc();
    }

    // Get audit logs by admin username
    public List<AuditLog> getLogsByAdmin(String adminUsername) {
        return auditLogRepository.findByAdminUsernameOrderByTimestampDesc(adminUsername);
    }

    // Get audit logs by action type
    public List<AuditLog> getLogsByAction(String action) {
        return auditLogRepository.findByActionOrderByTimestampDesc(action);
    }

    // Get audit logs from recent days
    public List<AuditLog> getRecentLogs(int days) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(days);
        return auditLogRepository.findByTimestampAfterOrderByTimestampDesc(cutoff);
    }
}
