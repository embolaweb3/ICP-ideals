export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'closeCampaign' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'contributeToCampaign' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Bool], []),
    'createCampaign' : IDL.Func([IDL.Text, IDL.Text, IDL.Nat], [IDL.Nat], []),
    'getCampaignStatistics' : IDL.Func(
        [IDL.Nat],
        [
          IDL.Record({
            'totalContributors' : IDL.Nat,
            'totalRaised' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'registerUser' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'searchCampaigns' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Nat,
              'title' : IDL.Text,
              'creator' : IDL.Principal,
              'goal' : IDL.Nat,
              'description' : IDL.Text,
              'isClosed' : IDL.Bool,
              'raised' : IDL.Nat,
              'contributors' : IDL.Vec(IDL.Principal),
            })
          ),
        ],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
