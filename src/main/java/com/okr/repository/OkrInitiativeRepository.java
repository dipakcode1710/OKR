package com.okr.repository;

import com.okr.entity.OkrInitiative;
import com.okr.entity.OkrInitiative.InitiativeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OkrInitiativeRepository extends JpaRepository<OkrInitiative, Integer> {

    List<OkrInitiative> findByKeyResultIdOrderBySortOrderAsc(Integer keyResultId);

    List<OkrInitiative> findByKeyResultIdAndInitiativeStatus(Integer keyResultId, InitiativeStatus status);

    List<OkrInitiative> findByOwnerEmployeeId(Integer employeeId);
}
