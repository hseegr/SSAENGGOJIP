package com.sds.baseproject.user.repository;

import com.sds.baseproject.user.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;


    @Test
    @Rollback(value = false)
    public void saveNewUser() {
        User user = new User();
        user.setName("Tester");
        user.setLoginId("test2222@test.com");
        user.setPassword("test");

        user = this.userRepository.save(user);
    }

}
