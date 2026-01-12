/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adAccounts from "../adAccounts.js";
import type * as functions_addCredits from "../functions/addCredits.js";
import type * as functions_createUser from "../functions/createUser.js";
import type * as functions_getUser from "../functions/getUser.js";
import type * as platforms from "../platforms.js";
import type * as scraper from "../scraper.js";
import type * as social from "../social.js";
import type * as stores from "../stores.js";
import type * as user from "../user.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adAccounts: typeof adAccounts;
  "functions/addCredits": typeof functions_addCredits;
  "functions/createUser": typeof functions_createUser;
  "functions/getUser": typeof functions_getUser;
  platforms: typeof platforms;
  scraper: typeof scraper;
  social: typeof social;
  stores: typeof stores;
  user: typeof user;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
