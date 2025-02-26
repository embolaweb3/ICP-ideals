import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'closeCampaign' : ActorMethod<[bigint], boolean>,
  'contributeToCampaign' : ActorMethod<[bigint, bigint], boolean>,
  'createCampaign' : ActorMethod<[string, string, bigint], bigint>,
  'getCampaignStatistics' : ActorMethod<
    [bigint],
    { 'totalContributors' : bigint, 'totalRaised' : bigint }
  >,
  'registerUser' : ActorMethod<[string], boolean>,
  'searchCampaigns' : ActorMethod<
    [string],
    Array<
      {
        'id' : bigint,
        'title' : string,
        'creator' : Principal,
        'goal' : bigint,
        'description' : string,
        'isClosed' : boolean,
        'raised' : bigint,
        'contributors' : Array<Principal>,
      }
    >
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
