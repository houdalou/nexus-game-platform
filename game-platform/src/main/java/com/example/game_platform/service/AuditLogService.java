package com.example.game_platform.service;

import com.example.game_platform.entity.AuditLog;
import com.example.game_platform.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

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

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findByOrderByTimestampDesc();
    }

    public List<AuditLog> getLogsByAdmin(String adminUsername) {
        return auditLogRepository.findByAdminUsernameOrderByTimestampDesc(adminUsername);
    }

    public List<AuditLog> getLogsByAction(String action) {
        return auditLogRepository.findByActionOrderByTimestampDesc(action);
    }

    public List<AuditLog> getRecentLogs(int days) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(days);
        return auditLogRepository.findByTimestampAfterOrderByTimestampDesc(cutoff);
    }
}
