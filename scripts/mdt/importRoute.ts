﻿import fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { importRoute } from '../../src/server/importRoute.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const testString =
  '!LrvxpYnimW)sbY3pET9HE9b6jXP(OLYUlCk9stA3LC96)(ITjSaNuu2n2W4XJhaeWZG(YS1oFEFX9pqjQa9(8fq)vZM(H5)m)TtNa90LlBR)WC9282kOAevTGE70pnND38a4a9Btl7geRZ7xVAwDpTVS4bl(TE)0I5ndh73(K4(uc6vd)xvlOKGQZdNsicX6Oy9GQguduM2qgj9iOm1ifoVTSDf0wBTXAXLkj(WrXyJMeGBiWAIFHGHW4WFEodT609jJR8ovYX6yrewCqrwhkOLlJl3LWYXa3BZ4G9eXH6WwQZaqMY9UIEM2xxsPCOA(mkM4CtnMPZTX0cQHi2s6lwouLeCx4Dj4w6PNb6zSyg4vBhxg(LG1eQIUmoYD8yMsnY1UkJqmjfThaNwWrwIogc9PnxpTVbU79yMkrKzjqQdJ3r2jblG9rDpk2Oi0emRJLCMTKy(M7UAESpelKSWLH0OyqDmWl9vQ6K1PAs)OnJQImE4kpnC4Aln7rRzWV2L0rsULenSNPMv3GB)4er5HQc)DKY1PuUl9Cd7zpsna8TajTUmT15PstMHGoZGi1dF8irSdLbRb1GSfFKAWAMr40eV9PIwKGNYH4YwoIiC8q2X)x2Z6tFqbhyjuogATHcjNUxQQy0pwWAu2ompU41QFzF9fZ26JxE3xUEq7mMFnV(c4VY(MzXF9mEF9DG1xNTUVBT3mo((3Q7i6mV7F)WRtHY(00IX5mpUA3qQmT72(mghH)tfRblpP()1yEf4JTW))'

const route = importRoute(testString)

fs.writeFileSync(`${__dirname}/../../src/data/vp_route.json`, JSON.stringify(route))
