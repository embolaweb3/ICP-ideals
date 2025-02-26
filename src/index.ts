import { IDL, query, update, Principal, msgCaller } from 'azle';

/**
 * Represents a user in the PeerRaise system.
 * @typedef {Object} User
 * @property {Principal} id - The Principal of the user.
 * @property {string} username - The username of the user.
 */
const User = IDL.Record({
    id: IDL.Principal,
    username: IDL.Text
});

/**
 * Represents a crowdfunding campaign in the PeerRaise system.
 * @typedef {Object} Campaign
 * @property {number} id - The unique ID of the campaign.
 * @property {string} title - The title of the campaign.
 * @property {string} description - The description of the campaign.
 * @property {Principal} creator - The Principal of the campaign creator.
 * @property {number} goal - The funding goal of the campaign.
 * @property {number} raised - The total amount raised for the campaign.
 * @property {Principal[]} contributors - The list of contributors to the campaign.
 * @property {boolean} isClosed - Whether the campaign is closed.
 */
const Campaign = IDL.Record({
    id: IDL.Nat,
    title: IDL.Text,
    description: IDL.Text,
    creator: IDL.Principal,
    goal: IDL.Nat,
    raised: IDL.Nat,
    contributors: IDL.Vec(IDL.Principal),
    isClosed: IDL.Bool
});

/**
 * Represents a contribution to a campaign.
 * @typedef {Object} Contribution
 * @property {number} campaignId - The ID of the campaign being contributed to.
 * @property {Principal} contributor - The Principal of the contributor.
 * @property {number} amount - The amount contributed.
 */
const Contribution = IDL.Record({
    campaignId: IDL.Nat,
    contributor: IDL.Principal,
    amount: IDL.Nat
});

// Manually define TypeScript types for the structures
type User = {
    id: Principal;
    username: string;
};

type Campaign = {
    id: number;
    title: string;
    description: string;
    creator: Principal;
    goal: number;
    raised: number;
    contributors: Principal[];
    isClosed: boolean;
};

type Contribution = {
    campaignId: number;
    contributor: Principal;
    amount: number;
};

/**
 * PeerRaise is a crowdfunding platform built on the Internet Computer.
 * It allows users to register, create campaigns, contribute to campaigns,
 * and retrieve campaign statistics.
 */
export default class PeerRaise {
    private users: User[] = [];
    private campaigns: Campaign[] = [];
    private contributions: Contribution[] = [];
    private nextCampaignId: number = 0;

    /**
     * Registers a new user with a unique username.
     * @param {string} username - The username of the user.
     * @returns {boolean} - True if the user was registered successfully, false if the username is already taken.
     */
    @update([IDL.Text], IDL.Bool)
    registerUser(username: string): boolean {
        const caller = msgCaller(); // Get the caller's principal
        const existingUser = this.users.find(user => user.id.toText() === caller.toText());
        if (existingUser) {
            return false; // User already registered
        }
        this.users.push({
            id: caller,
            username
        });
        return true;
    }

    /**
     * Creates a new crowdfunding campaign.
     * @param {string} title - The title of the campaign.
     * @param {string} description - The description of the campaign.
     * @param {number} goal - The funding goal of the campaign.
     * @returns {number} - The ID of the newly created campaign.
     */
    @update([IDL.Text, IDL.Text, IDL.Nat], IDL.Nat)
    createCampaign(title: string, description: string, goal: number): number {
        const caller = msgCaller(); // Get the caller's principal
        const campaignId = this.nextCampaignId++;
        this.campaigns.push({
            id: campaignId,
            title,
            description,
            creator: caller,
            goal,
            raised: 0,
            contributors: [],
            isClosed: false
        });
        return campaignId;
    }

    /**
     * Contributes to a campaign.
     * @param {number} campaignId - The ID of the campaign to contribute to.
     * @param {number} amount - The amount to contribute.
     * @returns {boolean} - True if the contribution was successful, false if the campaign is closed or not found.
     */
    @update([IDL.Nat, IDL.Nat], IDL.Bool)
    contributeToCampaign(campaignId: number, amount: number): boolean {
        const caller = msgCaller(); // Get the caller's principal
        const campaign = this.campaigns.find(c => c.id === campaignId);
        if (!campaign || campaign.isClosed) {
            return false; // Campaign not found or closed
        }
        campaign.raised += amount;
        campaign.contributors.push(caller);
        this.contributions.push({
            campaignId,
            contributor: caller,
            amount
        });
        return true;
    }

    /**
     * Closes a campaign to prevent further contributions.
     * @param {number} campaignId - The ID of the campaign to close.
     * @returns {boolean} - True if the campaign was closed successfully, false if the campaign is already closed or not found.
     */
    @update([IDL.Nat], IDL.Bool)
    closeCampaign(campaignId: number): boolean {
        const campaign = this.campaigns.find(c => c.id === campaignId);
        if (!campaign || campaign.isClosed) {
            return false; // Campaign not found or already closed
        }
        campaign.isClosed = true;
        return true;
    }

    /**
     * Searches for campaigns by title or description.
     * @param {string} query - The search query.
     * @returns {Campaign[]} - A list of campaigns matching the query.
     */
    @query([IDL.Text], IDL.Vec(Campaign))
    searchCampaigns(query: string): Campaign[] {
        const lowercaseQuery = query.toLowerCase();
        return this.campaigns.filter(campaign =>
            campaign.title.toLowerCase().includes(lowercaseQuery) ||
            campaign.description.toLowerCase().includes(lowercaseQuery)
        );
    }

    /**
     * Retrieves statistics for a specific campaign.
     * @param {number} campaignId - The ID of the campaign.
     * @returns {Object} - An object containing the total amount raised and the number of contributors.
     * @property {number} totalRaised - The total amount raised for the campaign.
     * @property {number} totalContributors - The number of contributors to the campaign.
     */
    @query([IDL.Nat], IDL.Record({
        totalRaised: IDL.Nat,
        totalContributors: IDL.Nat
    }))
    getCampaignStatistics(campaignId: number): { totalRaised: number, totalContributors: number } {
        const campaign = this.campaigns.find(c => c.id === campaignId);
        if (!campaign) {
            return { totalRaised: 0, totalContributors: 0 }; // Campaign not found
        }
        return {
            totalRaised: campaign.raised,
            totalContributors: campaign.contributors.length
        };
    }
}