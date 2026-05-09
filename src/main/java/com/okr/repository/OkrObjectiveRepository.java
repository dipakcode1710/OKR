package com.okr.repository;

import com.okr.entity.OkrObjective;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OkrObjectiveRepository extends JpaRepository<OkrObjective, Integer> {

    Optional<OkrObjective> findByPublicId(String publicId);

    List<OkrObjective> findByCycleIdAndDeletedAtIsNull(Integer cycleId);

    List<OkrObjective> findByOwnerEmployeeIdAndDeletedAtIsNull(Integer employeeId);

    List<OkrObjective> findByOwnerTeamIdAndDeletedAtIsNull(Integer teamId);

    List<OkrObjective> findByStatusAndDeletedAtIsNull(OkrObjective.ObjectiveStatus status);

    List<OkrObjective> findByDeletedAtIsNull();

    @Query("SELECT o FROM OkrObjective o WHERE o.parentObjective.id = :parentId AND o.deletedAt IS NULL")
    List<OkrObjective> findByParentObjectiveId(@Param("parentId") Integer parentId);

    @Query("SELECT o FROM OkrObjective o WHERE o.alignedObjective.id = :alignedId AND o.deletedAt IS NULL")
    List<OkrObjective> findByAlignedObjectiveId(@Param("alignedId") Integer alignedId);

    boolean existsByPublicId(String publicId);
}
