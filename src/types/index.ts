// externalize types to `collect-mentions`
export interface Mention {
  index: number;
  handle: string;
  mention: string;
}

export interface Commit {
  header: {
    type: string,
    scope: string,
    subject: string,
    toString(): string,
  };
  body: string | null;
  footer: string | null;
  mentions?: Mention[];
  increment?: string;
  isBreaking?: boolean;
}

export type Plugin = (commit: Commit) => { [key: string]: any } | void;
export type Mappers = { [key: string]: Plugin };
