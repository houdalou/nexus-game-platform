package com.example.game_platform.repository;

import com.example.game_platform.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

// Repository interface for AuditLog entity
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    // Get all audit logs ordered by timestamp descending
    List<AuditLog> findByOrderByTimestampDesc();
    
    // Get audit logs by admin username ordered by timestamp descending
    List<AuditLog> findByAdminUsernameOrderByTimestampDesc(String adminUsername);
    
    // Get audit logs by action type ordered by timestamp descending
    List<AuditLog> findByActionOrderByTimestampDesc(String action);
    
    // Get audit logs after specified timestamp ordered by timestamp descending
    List<AuditLog> findByTimestampAfterOrderByTimestampDesc(LocalDateTime date);
}
