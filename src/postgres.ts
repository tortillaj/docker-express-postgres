import { Pool, PoolConfig } from 'pg'

export class HooplaPostgresConnection {
  pool: Pool
  private readonly user: string
  private readonly password: string
  private readonly host: string
  private readonly database: string
  private readonly port: number
  private readonly applicationName: string

  constructor(user: string, password: string, host: string, database: string, port: number) {
    this.user = user
    this.password = password
    this.host = host
    this.database = database
    this.port = port
    this.applicationName = `docker-express-postgres`

    this.pool = this.getConnectionPool()
  }

  getPool() {
    return this.pool
  }

  stopPool() {
    return this.pool.end()
  }

  getConnectionPool() {
    if (!this.pool) {

      // Create Postgres connection pool
      const config: PoolConfig = {
        user: this.user,
        host: this.host,
        password: this.password,
        database: this.database,
        port: this.port,
        max: 50, // max active connections,
        application_name: this.applicationName,
      }

      this.pool = new Pool(config)
    }

    return this.pool
  }
}