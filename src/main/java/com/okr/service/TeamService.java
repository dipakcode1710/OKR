package com.okr.service;

import com.okr.dto.TeamDTO;
import com.okr.entity.Team;
import com.okr.exception.ResourceNotFoundException;
import com.okr.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TeamService {

    private final TeamRepository teamRepository;

    // CREATE
    public TeamDTO.Response create(TeamDTO.Request request) {
        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        return toResponse(teamRepository.save(team));
    }

    // READ ALL
    @Transactional(readOnly = true)
    public List<TeamDTO.Response> getAll() {
        return teamRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // READ BY ID
    @Transactional(readOnly = true)
    public TeamDTO.Response getById(Integer id) {
        return toResponse(findOrThrow(id));
    }

    // SEARCH BY NAME
    @Transactional(readOnly = true)
    public List<TeamDTO.Response> searchByName(String name) {
        return teamRepository.findByNameContainingIgnoreCase(name)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // UPDATE
    public TeamDTO.Response update(Integer id, TeamDTO.Request request) {
        Team team = findOrThrow(id);
        team.setName(request.getName());
        team.setDescription(request.getDescription());
        return toResponse(teamRepository.save(team));
    }

    // DELETE
    public void delete(Integer id) {
        Team team = findOrThrow(id);
        teamRepository.delete(team);
    }

    // HELPER
    private Team findOrThrow(Integer id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", id));
    }

    private TeamDTO.Response toResponse(Team team) {
        return TeamDTO.Response.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .build();
    }
}
