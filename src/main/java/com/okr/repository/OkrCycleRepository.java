package com.okr.repository;

import com.okr.entity.OkrCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OkrCycleRepository extends JpaRepository<OkrCycle, Integer> {

    List<OkrCycle> findAllByOrderByStartDateDesc();

    List<OkrCycle> findByIsActiveTrue();

    Optional<OkrCycle> findByCycleCode(String cycleCode);

    boolean existsByCycleCode(String cycleCode);
}
