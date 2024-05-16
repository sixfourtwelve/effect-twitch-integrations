import { Config, Context, Effect, Layer, Secret } from "effect";
import AccessTokenJson from "../do_not_open_on_stream/access-token.json";
import type { AccessToken } from "@spotify/web-api-ts-sdk";

// TODO Schema decode
const accessToken: AccessToken = AccessTokenJson as unknown as AccessToken;

const scopes = [
	"user-read-playback-state",
	"user-modify-playback-state",
	"user-read-currently-playing",
	"app-remote-control",
	"streaming",
	"playlist-read-private",
	"playlist-read-collaborative",
	"playlist-modify-private",
	"playlist-modify-public",
	"user-read-playback-position",
	"user-top-read",
	"user-read-recently-played",
	"user-library-modify",
	"user-library-read",
	"user-read-email",
	"user-read-private",
];

export type ISpotifyConfig = Readonly<{
	accessToken: AccessToken;
	clientId: string;
	clientSecret: Secret.Secret;
	scopes: Array<string>;
	port: number;
	redirectServerPath: string;
}>;

const make = Effect.gen(function* (_) {
	const clientId = yield* Config.string("SPOTIFY_CLIENT_ID");
	const clientSecret = yield* Config.secret("SPOTIFY_CLIENT_SECRET");
	const port = yield* Config.number("REDIRECT_SERVER_PORT").pipe(
		Config.withDefault(3939),
	);
	const redirectServerPath = yield* Config.string("REDIRECT_SERVER_PATH").pipe(
		Config.withDefault("redirect"),
	);

	return {
		accessToken,
		clientId,
		clientSecret,
		port,
		scopes,
		redirectServerPath,
	} as const satisfies ISpotifyConfig;
});

export class SpotifyConfig extends Context.Tag("spotify-config")<
	SpotifyConfig,
	ISpotifyConfig
>() {
	static Live = Layer.effect(SpotifyConfig, make);
}