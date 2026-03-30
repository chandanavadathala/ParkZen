package com.parkzen.Parkzen_stress_free_parking_experience.entity;



import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email"),
                @UniqueConstraint(columnNames = "mobile")
        }

)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String mobile;

    private String email;

    private String password;

    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    private Role role;

}
