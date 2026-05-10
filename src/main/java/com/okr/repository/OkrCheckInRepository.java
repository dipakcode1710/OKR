package com.okr.repository;

import com.okr.entity.OkrCheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OkrCheckInRepository extends JpaRepository<OkrCheckIn, Integer> {

    // All check-ins for an objective (timeline view)
    List<OkrCheckIn> findByObjectiveIdOrderByCheckInDateDesc(Integer objectiveId);

    // Check-ins for a specific key result
    List<OkrCheckIn> findByKeyResultIdOrderByCheckInDateDesc(Integer keyResultId);

    // All check-ins made by an employee
    List<OkrCheckIn> findByEmployeeIdOrderByCheckInDateDesc(Integer employeeId);

    // Check-ins for an objective in a specific week
    List<OkrCheckIn> findByObjectiveIdAndWeekNumber(Integer objectiveId, Integer weekNumber);
}
