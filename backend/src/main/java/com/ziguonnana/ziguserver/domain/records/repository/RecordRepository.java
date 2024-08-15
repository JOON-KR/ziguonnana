package com.ziguonnana.ziguserver.domain.records.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ziguonnana.ziguserver.domain.records.entity.Records;

@Repository
public interface RecordRepository extends JpaRepository<Records, Long>{
	Optional<List<Records>> findByMemberId(Long memberId);
}
