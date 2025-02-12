import Mux from "@mux/mux-node";
import environment from "./environment";
const mux = new Mux({
  tokenId: environment.MUX_TOKEN_ID as string,
  tokenSecret: environment.MUX_TOKEN_SECRET as string,
});


export default mux;
