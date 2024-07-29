package com.ziguonnana.ziguserver.domain.member.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record MemberRequest(
    @NotBlank(message = "이메일은 필수 입력 값입니다.") @Email(message = "이메일 형식에 맞지 않습니다.") String email,
    @NotBlank(message = "비밀번호는 필수 입력 값입니다.") @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,20}$", message = "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함한 8자 이상 20자 이하여야 합니다.") String password,
    @NotBlank(message = "닉네임은 필수 입력 값입니다.") String name,
    String profileImage,
    RoleType role) {
}
