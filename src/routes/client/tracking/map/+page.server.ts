import { trackerSchema, type Tracker } from '$lib/api/tracker.schema';
import { findOrgTrackerById } from '$lib/server/db/repo/vehicle-tracker';
import { acl } from '$lib/server/middlewares/auth';
import type { TrackerSelection } from '$lib/store/map.svelte';

export async function load({ url, locals }) {
	const { user } = acl(locals);

	let trackerToLookupId = parseInt(url.searchParams.get('lookupTracker') || '0');

	let tracker: Tracker | null = null;

	if (trackerToLookupId && !Number.isNaN(trackerToLookupId)) {
		const trackerFromDb = await findOrgTrackerById(trackerToLookupId, user.organization.id);
		tracker = trackerSchema.parse(trackerFromDb);
	}

	const initialTrackerSelection: TrackerSelection | undefined = tracker
		? { [tracker.id]: tracker }
		: undefined;

	return { initialTrackerSelection };
}
