package com.shikong.utils;

import org.apache.log4j.Logger;
import org.jose4j.jwk.RsaJsonWebKey;
import org.jose4j.jwk.RsaJwkGenerator;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.lang.JoseException;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Properties;

/**
 * Title：
 * Author:black
 * Createtime:2016-08-22 16:34
 */
public class TokenUtils {

    //日志文件
    private static Logger logger = Logger.getLogger(TokenUtils.class);

    private static int sessionMins;

    private static RsaJsonWebKey rsaJsonWebKey;

    private static JwtConsumer jwtConsumer;

    static {
        Properties props = new Properties();
        InputStream isp = TokenUtils.class.getClassLoader().getResourceAsStream("config.properties");
        try {
            props.load(new InputStreamReader(isp, "utf-8"));
        } catch (IOException e) {
            logger.error("token工具类初始化异常：", e);
        }
        String sessionMinsString =  props.getProperty("sessionMins");

        sessionMins = Integer.parseInt(sessionMinsString);

        try {
            rsaJsonWebKey = RsaJwkGenerator.generateJwk(2048);
            // Give the JWK a Key ID (kid), which is just the polite thing to do
            rsaJsonWebKey.setKeyId("k1");

            jwtConsumer = new JwtConsumerBuilder()
                    .setRequireExpirationTime() // the JWT must have an expiration time
                    .setMaxFutureValidityInMinutes(0) // but the  expiration time can't be too crazy
                    .setAllowedClockSkewInSeconds(30) // allow some leeway in validating time based claims to account for clock skew
                    .setRequireSubject() // the JWT must have a subject claim
                    .setExpectedIssuer("Issuer") // whom the JWT needs to have been issued by
                    .setExpectedAudience("Audience") // to whom the JWT is intended for
                    .setVerificationKey(rsaJsonWebKey.getKey()) // verify the signature with the public key
                    .build(); // create the JwtConsumer instance
        } catch (JoseException e) {
            logger.error("token工具类初始化异常：", e);
        }
    }

    public static String token(String username) throws JoseException {
        // Create the Claims, which will be the content of the JWT
        JwtClaims claims = new JwtClaims();
        claims.setIssuer("Issuer");  // who creates the token and signs it
        claims.setAudience("Audience"); // to whom the token is intended to be sent
        claims.setExpirationTimeMinutesInTheFuture(sessionMins); // time when the token will expire (10 minutes from now)
        claims.setGeneratedJwtId(); // a unique identifier for the token
        claims.setIssuedAtToNow();  // when the token was issued/created (now)
        claims.setNotBeforeMinutesInThePast(2); // time before which the token is not yet valid (2 minutes ago)
        claims.setSubject(username); // the subject/principal is whom the token is aboutclaims.setClaim("email","mail@example.com"); // additional claims/attributes about the subject can be added
        // A JWT is a JWS and/or a JWE with JSON claims as the payload.
        // In this example it is a JWS so we create a JsonWebSignature object.
        JsonWebSignature jws = new JsonWebSignature();

        // The payload of the JWS is JSON content of the JWT Claims
        jws.setPayload(claims.toJson());

        // The JWT is signed using the private key
        jws.setKey(rsaJsonWebKey.getPrivateKey());

        // Set the Key ID (kid) header because it's just the polite thing to do.
        // We only have one key in this example but a using a Key ID helps
        // facilitate a smooth key rollover process
        jws.setKeyIdHeaderValue(rsaJsonWebKey.getKeyId());
        // Set the signature algorithm on the JWT/JWS that will integrity protect the claims
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_USING_SHA256);

        // Sign the JWS and produce the compact serialization or the complete JWT/JWS
        // representation, which is a string consisting of three dot ('.') separated
        // base64url-encoded parts in the form Header.Payload.Signature
        // If you wanted to encrypt it, you can simply set this jwt as the payload
        // of a JsonWebEncryption object and set the cty (Content Type) header to "jwt".
        return jws.getCompactSerialization();
    }

    public static boolean check(String token) {

        try{
            //  Validate the JWT and process it to the Claims
            JwtClaims jwtClaims = jwtConsumer.processToClaims(token);
            logger.debug("JWT validation succeeded! " + jwtClaims);
            return true;
        }catch (InvalidJwtException e){
            logger.debug("Invalid JWT! " + e);
            return false;
        }
    }
}
