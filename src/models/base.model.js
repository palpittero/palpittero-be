import forEach from 'lodash/fp/forEach'
import knex from '../config/database'
import { STATUS } from '../shared/constants'

export default (tableName, columns = []) => {
  const fetchAll = async (where = {}) => {
    const query = knex(tableName).select('*')

    forEach.convert({ cap: false })((value, column) => {
      if (columns.includes(column)) {
        query.whereLike(column, value)
      }
    }, where)

    query.where('status', '<>', STATUS.DELETED)

    return query
  }

  const fetchById = (id) => knex(tableName).select('*').where({ id }).first()

  const insert = (row) => knex(tableName).insert(row)

  const update = (row) => knex(tableName).update(row).where({ id: row.id })

  const del = (where) => knex(tableName).where(where).delete()

  const replace = (rows) => {
    const insert = knex(tableName)
      .insert(rows)
      .toString()
      .replace(/^INSERT/i, 'REPLACE')

    return knex.raw(insert)
  }

  const batchDelete = ({ columnName = 'id', values }, soft) => {
    if (soft) {
      return knex(tableName)
        .update({ status: STATUS.DELETED })
        .whereIn(columnName, values)
    }

    return knex(tableName).del().whereIn(columnName, values)
  }

  const batchUpdate = (rows) => {
    console.log('batch update', rows)
    return knex.transaction((trx) => {
      const queries = rows.map(({ id, ...row }) =>
        knex(tableName).update(row).where({ id }).transacting(trx)
      )

      Promise.all(queries).then(trx.commit).catch(trx.rollback)
    })
  }

  const batchInsert = (rows) => {
    console.log('batch update', rows)

    return knex.transaction((trx) => {
      const queries = rows.map((row) =>
        knex(tableName).insert(row).transacting(trx)
      )

      Promise.all(queries).then(trx.commit).catch(trx.rollback)
    })
  }

  return {
    fetchAll,
    fetchById,
    insert,
    update,
    delete: del,
    replace,
    batchDelete,
    batchUpdate,
    batchInsert
  }
}
