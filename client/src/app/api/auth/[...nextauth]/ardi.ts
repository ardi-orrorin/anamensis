import { OAuthConfig } from "next-auth/providers/oauth"

export const Ardi = ({
    clientId,
    clientSecret,
}:{
    clientId: string;
    clientSecret: string;
}) => ({
    id: "ardi",
    name: "Ardi",
    type: "oauth",
    version: "2.0",
    wellKnown: "http://localhost:8099/.well-known/openid-configuration",
    authorization: {
        params: {
            response_type: "code",
            scope: ["openid", "name", "birthday", "phone"].join(" "),
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