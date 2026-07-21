package com.dearme.backend.repository;


    import com.dearme.backend.entity.CycleEntry;
    import org.springframework.data.jpa.repository.JpaRepository;
    public interface CycleEntryRepository extends JpaRepository<CycleEntry,Long>{
        

}
