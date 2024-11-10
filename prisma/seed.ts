import { PrismaClient } from '@prisma/client'
import { partyData, PREDEFINED_CANDIDATES, electionInfo } from '../src/data/data'


const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Starting to seed database...')

    // Clear existing data
    await prisma.$transaction([
      prisma.candidate.deleteMany(),
      prisma.politician.deleteMany(),
      prisma.party.deleteMany(),
      prisma.electionInfo.deleteMany(),
    ])

    console.log('Cleaned up existing data')

    // Create parties
    const parties = await Promise.all(
      partyData.map(async (party) => {
        return await prisma.party.create({
          data: {
            description: party.description,
            title: party.title,
            emoji: party.emoji,
            ctaText: party.ctaText,
            ctaLink: party.ctaLink,
            content: party.content,
          },
        })
      })
    )

    console.log(`Created ${parties.length} parties`)

    // Create a map of party titles to their IDs for easy lookup
    const partyMap = new Map(parties.map(party => [party.title, party.id]))

    // Create all politicians first
    const politicianMap = new Map()

    for (const candidate of PREDEFINED_CANDIDATES) {
      // Create president politician if not exists
      if (!politicianMap.has(candidate.president.name)) {
        const presPartyId = partyMap.get(candidate.president.party)
        if (!presPartyId) {
          throw new Error(`Party not found for president: ${candidate.president.party}`)
        }
        
        const president = await prisma.politician.create({
          data: {
            name: candidate.president.name,
            age: candidate.president.age,
            sex: candidate.president.sex,
            partyId: presPartyId,
          },
        })
        politicianMap.set(president.name, president.id)
      }

      // Create vice president politician if not exists
      if (!politicianMap.has(candidate.vicePresident.name)) {
        const vicePartyId = partyMap.get(candidate.vicePresident.party)
        if (!vicePartyId) {
          throw new Error(`Party not found for vice president: ${candidate.vicePresident.party}`)
        }

        const vicePresident = await prisma.politician.create({
          data: {
            name: candidate.vicePresident.name,
            age: candidate.vicePresident.age,
            sex: candidate.vicePresident.sex,
            partyId: vicePartyId,
          },
        })
        politicianMap.set(vicePresident.name, vicePresident.id)
      }
    }

    console.log(`Created ${politicianMap.size} politicians`)

    // Create candidate pairs
    const candidates = await Promise.all(
      PREDEFINED_CANDIDATES.map(async (candidate) => {
        const presidentId = politicianMap.get(candidate.president.name)
        const vicePresidentId = politicianMap.get(candidate.vicePresident.name)

        if (!presidentId || !vicePresidentId) {
          throw new Error(
            `Could not find IDs for presidential pair: ${candidate.president.name} / ${candidate.vicePresident.name}`
          )
        }

        return await prisma.candidate.create({
          data: {
            presidentId,
            vicePresidentId,
          },
        })
      })
    )

    console.log(`Created ${candidates.length} candidate pairs`)

    // Create election info
    const election = await prisma.electionInfo.create({
      data: {
        title: electionInfo.title,
        description: electionInfo.description,
      },
    })

    console.log('Created election info')
    console.log('Database seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })