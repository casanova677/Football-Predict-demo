import 'server-only'
import getFixtures from './getFixtures';
import { Fixture } from '@/types';



export default async function getFixtureByFixtureId(id: any): Promise<Fixture | undefined> {
    try {
        const allFixturesByLeague = await getFixtures ();

        for (const league of allFixturesByLeague) {
            for (const fixture of league.fixtures) {
                if (fixture.fixture.id === id) {
                    return fixture;
                }
            }
        }
  
        return undefined;
    } catch (error) {
        console.error('Error occured while fetching fixture by fixture Id: ', error);
    }
}