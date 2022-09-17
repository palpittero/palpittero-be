import axios from 'axios'
import knex from '../src/config/database'

const fetchCountries = () => axios.get(process.env.COUNTRIES_API_URL)
