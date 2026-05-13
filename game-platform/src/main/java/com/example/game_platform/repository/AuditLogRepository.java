package com.example.game_platform.repository;

import com.example.game_platform.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByOrderByTimestampDesc();
    List<AuditLog> findByAdminUsernameOrderByTimestampDesc(String adminUsername);
    List<AuditLog> findByActionOrderByTimestampDesc(String action);
    List<AuditLog> findByTimestampAfterOrderByTimestampDesc(LocalDateTime date);
}
