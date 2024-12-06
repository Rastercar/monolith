import type { PaginationWithFilters } from '$lib/api/common';
import type {
	CreateTrackerBody,
	GetTrackerLocationsFilters,
	GetTrackersFilters,
	UpdateTrackerBody
} from '$lib/api/tracker.schema';
import { and, eq, gt, ilike, isNotNull, isNull, lt, type SQL } from 'drizzle-orm';
import { db } from '../db';
import { getISOFormatDateQuery } from '../helpers';
import { paginate } from '../pagination';
import { simCard, vehicleTracker, vehicleTrackerLocation } from '../schema';

export async function findOrgTrackersWithPagination(
	orgId: number,
	params: PaginationWithFilters<GetTrackersFilters>
) {
	const { pagination, filters } = params;

	const sqlFilters: SQL[] = [eq(vehicleTracker.organizationId, orgId)];

	if (filters?.imei) sqlFilters.push(ilike(vehicleTracker.imei, `%${filters.imei}%`));

	if (filters?.withAssociatedVehicle !== undefined) {
		const filter = filters.withAssociatedVehicle
			? isNotNull(vehicleTracker.vehicleId)
			: isNull(vehicleTracker.vehicleId);

		sqlFilters.push(filter);
	}

	return paginate(pagination, vehicleTracker, sqlFilters);
}

export async function findTrackerLocationList(id: number, options: GetTrackerLocationsFilters) {
	const sqlFilters: SQL[] = [eq(vehicleTrackerLocation.vehicleTrackerId, id)];

	if (options.before) {
		sqlFilters.push(lt(vehicleTrackerLocation.time, options.before));
	}

	if (options.after) {
		sqlFilters.push(gt(vehicleTrackerLocation.time, options.after));
	}

	return db
		.select({
			time: getISOFormatDateQuery(vehicleTrackerLocation.time),
			point: vehicleTrackerLocation.point
		})
		.from(vehicleTrackerLocation)
		.where(and(...sqlFilters))
		.limit(options.limit);

	// TODO: rm me !
	// let (q, args) = SeaQuery::select()
	//     .column(vehicle_tracker_location::Column::Time)
	//     .column(vehicle_tracker_location::Column::Point)
	//     .from(vehicle_tracker_location::Entity)
	//     .cond_where(
	//         Cond::all()
	//             .add(Expr::col(vehicle_tracker_location::Column::VehicleTrackerId).eq(tracker.id))
	//             .add_option(
	//                 search_query
	//                     .after
	//                     .map(|a| Expr::col(vehicle_tracker_location::Column::Time).gt(a)),
	//             )
	//             .add_option(
	//                 search_query
	//                     .before
	//                     .map(|b| Expr::col(vehicle_tracker_location::Column::Time).lt(b)),
	//             ),
	//     )
	//     .order_by(
	//         vehicle_tracker_location::Column::Time,
	//         search_query.order.into(),
	//     )
	//     .limit(search_query.limit.unwrap_or(15))
	//     .to_owned()
	//     .build_sqlx(PostgresQueryBuilder);
	// let rows: Vec<(
	//     DateTime<Utc>,
	//     geozero::wkb::Decode<geo_types::Geometry<f64>>,
	// )> = sqlx::query_as_with(&q, args)
	//     .fetch_all(db.get_postgres_connection_pool())
	//     .await
	//     .map_err(|_| internal_error_res())?;
	// let positions: Vec<dto::TrackerLocationDto> = rows
	//     .iter()
	//     .filter_map(|row| {
	//         if let Some(geo_types::Geometry::Point(point)) = row.1.geometry {
	//             let loc = dto::TrackerLocationDto {
	//                 point: point.into(),
	//                 time: row.0,
	//             };
	//             return Some(loc);
	//         }
	//         None
	//     })
	//     .collect();
	// Ok(Json(positions))
}

export function findOrgTrackerById(id: number, orgId: number) {
	return db.query.vehicleTracker.findFirst({
		where: (vehicleTracker, { eq, and }) =>
			and(eq(vehicleTracker.organizationId, orgId), eq(vehicleTracker.id, id)),
		with: {
			vehicle: true,
			simCards: true
		}
	});
}

export async function createOrgTracker(orgId: number, body: CreateTrackerBody) {
	const [createdTracker] = await db
		.insert(vehicleTracker)
		.values({ ...body, organizationId: orgId })
		.returning();

	return createdTracker;
}

export async function updateOrgTracker(id: number, orgId: number, body: UpdateTrackerBody) {
	const [updatedTracker] = await db
		.update(vehicleTracker)
		.set(body)
		.where(and(eq(vehicleTracker.id, id), eq(vehicleTracker.organizationId, orgId)))
		.returning();

	return updatedTracker;
}

export function deleteOrgTrackerById(id: number, orgId: number, deleteAssociatedSimCards: boolean) {
	return db.transaction(async (tx) => {
		if (deleteAssociatedSimCards) {
			await tx
				.delete(simCard)
				.where(and(eq(simCard.vehicleTrackerId, id), eq(simCard.organizationId, orgId)));
		}

		await tx
			.delete(vehicleTracker)
			.where(and(eq(vehicleTracker.id, id), eq(vehicleTracker.organizationId, orgId)));

		// if there was a deleted tracker, we know it belongs to the user org so
		// we delete from the vehicle tracker location manually since this
		// table does not have a FK with ON DELETE CASCADE; to the vehicle_tracker
		// table for performance reasons
		await tx.delete(vehicleTrackerLocation).where(eq(vehicleTrackerLocation.vehicleTrackerId, id));
	});
}
