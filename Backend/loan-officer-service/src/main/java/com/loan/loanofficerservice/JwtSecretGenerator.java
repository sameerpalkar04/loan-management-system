package com.loan.loanofficerservice;

import io.jsonwebtoken.io.Encoders;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class JwtSecretGenerator {

    public static void main(String[] args) throws Exception {
        KeyGenerator keyGenerator = KeyGenerator.getInstance("HmacSHA256");

        SecretKey secretKey = keyGenerator.generateKey();

        System.out.println(
                Encoders.BASE64.encode(secretKey.getEncoded())
        );
    }
}