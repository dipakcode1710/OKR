package com.okr.repository;

import com.okr.entity.OkrKeyResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OkrKeyResultRepository extends JpaRepository<OkrKeyResult, Integer> {

    List<OkrKeyResult> findByObjectiveId(Integer objectiveId);

    List<OkrKeyResult> findByObjectiveIdAndIsActiveTrue(Integer objectiveId);

    // Used for weighted-average rollup to objective
    @Query("SELECT kr FROM OkrKeyResult kr WHERE kr.objective.id = :objectiveId AND kr.isActive = true")
    List<OkrKeyResult> findActiveByObjectiveId(@Param("objectiveId") Integer objectiveId);
}
