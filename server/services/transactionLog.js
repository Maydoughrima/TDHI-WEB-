import pool from "../config/db.js";

export async function transactionLog({
  actorId,
  actorRole,
  action,
  entity,
  entityId = null,
  referenceCode = null,
  status,
  description = null,
}) {
  const query = `
    INSERT INTO transactions (
      actor_id,
      actor_role,
      action,
      entity,
      entity_id,
      reference_code,
      status,
      description
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING id
  `;

  const values = [
    actorId,
    actorRole,
    action,
    entity,
    entityId,
    referenceCode,
    status,
    description,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0].id;
}