import { OAuthConfig } from "next-auth/providers/oauth"

export const Custom = ({
    clientId,
    clientSecret,
}:{
    clientId     : string;
    clientSecret : string;
}) => ({
    id: "custom",
    name: "Custom",
    type: "oauth",
    version: "2.0",
    wellKnown: process.env.CUSTOM_OAUTH2_SERVER_URL + "/.well-known/openid-configuration",
    authorization: {
        params: {
            response_type: "code",
            scope: ["openid", "name", "phone"].join(" "),
        },
    },
    clientId,
    clientSecret,
    profile: (profile: any) => {
        return {
            id: profile.sub,
            name: profile.username,
            email: profile.email,
            image: profile.profile,
        }
    },
    checks: "none",
} as OAuthConfig<any>);