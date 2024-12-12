import axios from "axios";
import { ITokenIntrospect, TokenIntrospectResult } from "../interface";

export class TokenIntrospectRPCClient implements ITokenIntrospect {
  constructor(private readonly url: string) {}

  async introspect(token: string): Promise<TokenIntrospectResult> {
    try {
      const { data } = await axios.post(`${this.url}`, { token });
      const { userId, role } = data.data;
    
      return {
        payload: { userId, role },
        isOk: true,
      };
    } catch (error) {
      return {
        payload: null,
        error: (error as Error),
        isOk: false,
      };
    }
  }
}