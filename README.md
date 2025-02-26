# Deployed Canister Interface

![UI-canister](https://github.com/user-attachments/assets/b789a590-2fe5-45fa-ab82-c0dabf8e91c7)

# PeerRaise Crowdfunding Platform

PeerRaise is a decentralized crowdfunding platform built on the Internet Computer (ICP) using Azle 0.27.0 and TypeScript. It allows users to register, create campaigns, contribute to campaigns, and retrieve campaign statistics. The platform is powered by a smart contract that ensures transparency, security, and decentralization.

---

## Features

- **User Registration**: Users can register with a unique username.
- **Campaign Creation**: Registered users can create crowdfunding campaigns with a title, description, and funding goal.
- **Contribute to Campaigns**: Users can contribute funds to campaigns.
- **Close Campaigns**: Campaign creators can close their campaigns to prevent further contributions.
- **Search Campaigns**: Users can search for campaigns by title or description.
- **Campaign Statistics**: Retrieve statistics for a specific campaign, such as total funds raised and the number of contributors.

---

## Smart Contract Functionality

The PeerRaise smart contract provides the following methods:

| Method Name             | Parameters                          | Return Type | Description                              |
|-------------------------|-------------------------------------|-------------|------------------------------------------|
| `registerUser`          | `username: string`                 | `boolean`   | Registers a new user.                    |
| `createCampaign`        | `title: string, description: string, goal: number` | `number` | Creates a new campaign.                  |
| `contributeToCampaign`  | `campaignId: number, amount: number` | `boolean` | Contributes to a campaign.               |
| `closeCampaign`         | `campaignId: number`               | `boolean`   | Closes a campaign.                       |
| `searchCampaigns`       | `query: string`                    | `Campaign[]` | Searches for campaigns by title or description. |
| `getCampaignStatistics` | `campaignId: number`               | `{ totalRaised: number, totalContributors: number }` | Retrieves campaign statistics. |

---
