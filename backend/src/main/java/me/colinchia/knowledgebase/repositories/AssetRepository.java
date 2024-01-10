package me.colinchia.knowledgebase.repositories;

import me.colinchia.knowledgebase.entities.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Integer> {

}
