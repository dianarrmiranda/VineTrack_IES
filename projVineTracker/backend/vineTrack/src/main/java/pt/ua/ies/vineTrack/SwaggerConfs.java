// package src.main.java.pt.ua.ies.vineTrack;

// import java.util.Arrays;
// import java.util.List;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpHeaders;

// import io.swagger.models.auth.In;
// import springfox.documentation.builders.ApiInfoBuilder;
// import springfox.documentation.builders.PathSelectors;
// import springfox.documentation.builders.RequestHandlerSelectors;
// import springfox.documentation.service.ApiInfo;
// import springfox.documentation.service.ApiKey;
// import springfox.documentation.service.AuthorizationScope;
// import springfox.documentation.service.Contact;
// import springfox.documentation.service.SecurityReference;
// import springfox.documentation.spi.DocumentationType;
// import springfox.documentation.spi.service.contexts.SecurityContext;
// import springfox.documentation.spring.web.plugins.Docket;

// @Configuration
// public class SwaggerConfs {
//     @Bean
//     public Docket api() {
//         return new Docket(DocumentationType.SWAGGER_2)
//                 .select()
//                 .apis(RequestHandlerSelectors.any()) // Substitua pelo pacote da sua aplicação
//                 .paths(PathSelectors.any())
//                 .build()
//                 .apiInfo(apiInfo());
//     }

//     private ApiInfo apiInfo() {
//         return new ApiInfoBuilder()
//                 .title("VineTrack REST API")
//                 .description("Monitoring your Vines.")
//                 .version("1.0.0")
//                 .build();
//     }
// //     @Bean
// //     public Docket api() {
// //         return new Docket(DocumentationType.SWAGGER_2)
// //                 .select()
// //                 .apis(RequestHandlerSelectors.any())
// //                 .paths(PathSelectors.any())
// //                 .build()
// //                 .securitySchemes(Arrays.asList(new ApiKey("Token Access", HttpHeaders.AUTHORIZATION, In.HEADER.name())))
// //                 .securityContexts(Arrays.asList(securityContext()))
// //                 .apiInfo(apiInfo());
// //     }

// //     private ApiInfo apiInfo() {
// //         return new ApiInfoBuilder()
// //                 .title("VineTrack REST API")
// //                 .description("Monitoring your Vines.")
// //                 .version("1.0.0")
// //                 .license("Apache License Version 2.0")
// //                 .licenseUrl("https://www.apache.org/licenses/LICENSE-2.0")
// //                 .build();
// //     }

// //    private SecurityContext securityContext() {
// //         return SecurityContext.builder()
// //                 .securityReferences(defaultAuth())
// //                 .forPaths(PathSelectors.ant("api/patients/**"))
// //                 .forPaths(PathSelectors.ant("api/professionals/**"))
// //                 .build();
// //     }
// /*
//     List<SecurityReference> defaultAuth() {
//         AuthorizationScope authorizationScope
//                 = new AuthorizationScope("admin", "accessEverything");
//         AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
//         authorizationScopes[0] = authorizationScope;
//         return Arrays.asList( new SecurityReference("Token Access", authorizationScopes));
//     }*/

// }