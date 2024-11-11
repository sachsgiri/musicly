# Musicly : Music Management Service

The project structure has been copied and slightly modified from a [very popular template repository here.](https://github.com/Sairyss/domain-driven-hexagon/tree/master) 
Code examples are written using [NodeJS](https://nodejs.org/en/), [TypeScript](https://www.typescriptlang.org/), [NestJS](https://docs.nestjs.com/) framework and [Slonik](https://github.com/gajus/slonik) for the database access.

# Architecture

This is an attempt to combine multiple architectural patterns and styles together, such as:

- [Domain-Driven Design (DDD)](https://en.wikipedia.org/wiki/Domain-driven_design)
- [Hexagonal (Ports and Adapters) Architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))


![Domain-Driven Hexagon](assets/images/DomainDrivenHexagon.png)
<sup>Diagram is mostly based on [this one](https://github.com/hgraca/explicit-architecture-php#explicit-architecture-1) + others found online</sup>

In short, data flow looks like this (from left to right):

- Request/CLI command/event is sent to the controller using plain DTO;
- Controller parses this DTO, maps it to a Command/Query object format and passes it to an Application service;
- Application service handles this Command/Query; it executes business logic using domain services and entities/aggregates and uses the infrastructure layer through ports(interfaces);
- Infrastructure layer maps data to a format that it needs, retrieves/persists data from/to a database, uses adapters for other I/O communications (like sending an event to an external broker or calling external APIs), maps data back to domain format and returns it back to Application service;
- After the Application service finishes doing its job, it returns data/confirmation back to Controllers;
- Controllers return data back to the user (if application has presenters/views, those are returned instead).

Each layer is in charge of its own logic and has building blocks that usually should follow a [Single-responsibility principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) when possible and when it makes sense (for example, using `Repositories` only for database access, using `Entities` for business logic, etc.).

### Data Import

The data import is done using a CSV file. The example csvs are added in the repository. The import flow sequence diagram is as follows:

```mermaid

sequenceDiagram
    participant C as Client

    box Application

    participant A as Seeder Aggregate API
    participant Ar as Artist Aggregate API
    participant S as Songs Aggregate API
    participant PG as Repository (Postgres)

    end

    C->>+A:(HTTP-POST) <br/> localhost:3000/seeder/upload <br/> CSV File
    A->>-C: 200 OK
    A->> A: BullMQ/Redis Job
    note over A: Parse Artists and Songs Columns <br/> from CSV
    A->> Ar: ArtistService <br/> Create Artist
    Ar->> PG: Insert Artist
    A->> S: SongService <br/> Create Song
    S->> PG: Insert Song
```

### Artist APIs

#### User Likes An Artist & Sees the top 10 Artists

```mermaid

sequenceDiagram
    participant C as User

    box Application

    participant A as  Artist-Like Aggregate API
    participant Ar as Artist Aggregate API
         participant Re as Cache (Redis)

    participant PG as Repository (Postgres)

    end

    C->>+A:(HTTP-POST) <br/> localhost:3000/artists/like <br/> {artistId: uuid}
    note over A: Create ArtistLike Command
    A->> PG: Insert ArtistLike
    A->> Ar: UserLikedArtistDomainEvent
    A->>-C: 200 OK
    note over A: Increment Artist Like Count
    Ar->> PG: Update Artist
    Ar->> Re: Update Artist In The Top 100 Cache

    C->>+A:(HTTP-GET) <br/> localhost:3000/artists/top?limit=10
    note over A: Gets the top 10 Artists from Cache <br/> Updates the Cache if not present
    A->>+Re: Get Artists
    note over Re: Maintain a sorted set of Artists <br/> based on the likes
    Re->>-A: Artists
    A->>-C:  Artists

```

#### User unlikes an Artist & Sees the top 10 Artists

```mermaid

sequenceDiagram
    participant C as User

    box Application

    participant A as  Artist-Like Aggregate API
    participant Ar as Artist Aggregate API
         participant Re as Cache (Redis)

    participant PG as Repository (Postgres)

    end

    C->>+A:(HTTP-POST) <br/> localhost:3000/artists/like <br/> {artistId: uuid}
    note over A: Create Unlike Artist Command
    A->> PG: Delete ArtistLike
    A->> Ar: UserLikedArtistDomainEvent
    A->>-C: 200 OK
    note over A: Decrement Artist Like Count
    Ar->> PG: Update Artist
    Ar->> Re: Update Artist In The Top 100 Cache

    C->>+A:(HTTP-GET) <br/> localhost:3000/artists/top?limit=10
    note over A: Gets the top 10 Artists from Cache <br/> Updates the Cache if not present
    A->>+Re: Get Artists
    note over Re: Maintain a sorted set of Artists <br/> based on the likes
    Re->>-A: Artists
    A->>-C:  Artists

```
### Song APIs
#### User likes a Song & Sees the top 10 Songs

```mermaid

sequenceDiagram
    participant C as User

    box Application

    participant A as  Song-Like Aggregate API
    participant Ar as Song Aggregate API
    participant Art as Artist Aggregate API
    participant Re as Cache (Redis)

    participant PG as Repository (Postgres)

    end

    C->>+A:(HTTP-POST) <br/> localhost:3000/songs/like <br/> {artistId: uuid}
    note over A: Create Like Song Command
    A->> PG: Create SongLike
    A->> Ar: UserLikedSongDomainEvent
    A->>-C: 200 OK
    note over A: Increase Song Like Count
    Ar->> PG: Update Song
    Ar->> Re: Update Song In The Top 100 Cache

    A->> Art: UserLikedSongDomainEvent
    note over A: Increase Song Like Count for Artist
    Ar->> PG: Update Artist
    Ar->> Re: Update Artist In The Top 100 Cache

    C->>+A:(HTTP-GET) <br/> localhost:3000/songs/top?limit=10,year=2024
    note over A: Gets the top 10 Songs from Cache <br/> Updates the Cache if not present
    A->>+Re: Get Songs
    note over Re: Maintain a sorted set of Songs <br/> based on the likes
    Re->>-A: Songs
    A->>-C:  Songs

```
## DB Model
![DB Model](assets/images/db-model.png)

# How To Run

## Pre-requisites
You have docker and docker-compose installed on your machine. to test the apis, you can use postman or any other api testing tool. the curl docker commands are also provided below.

## Running the application

To run the application, you need to run the following command in the root directory of the project:

```bash
docker compose up -d --build
```

This will run the necessary containers, e.g. database etc. This will run the nestjs-app in watch mode so you can see the logs in the terminal. Please note that current directory is mounted to the container so any changes you make in the code will be reflected in the container.

Run the migrations to create the tables in the database:

```bash

docker exec -it nestjs-app pnpm migration:up
```

To import the data into the database, you can use the following command from the root directory of the project:

```bash

docker run --rm -v $(pwd):/app -w /app curlimages/curl:latest -F '
file=@music-single-sample.csv' http://host.docker.internal:3000/v1/seeder/upload
```


## Testing the application

### User Originated APIs

create a jwt token using the secret key provided in the .env file with sub = uuid of the user.

like a artist:

```bash
curl --location 'http://localhost:3000/v1/artists/like' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0YjhhMTA2OS0wZDhlLTRjNzUtOGNmOC00YzA2ZWE3ZWE5YWEiLCJuYW1lIjoiU2FjaGluIEdpcmkiLCJpYXQiOjE1MTYyMzkwMjJ9.bFi8cVnjgF1lZpLNVwdoCCdrTja0rPsDo9MvgVV013Q' \
--data '{
    "artistId" : "e3105d25-aa00-4378-ac1b-f2ba2a6b73cf"
}'
```

play a song:

```bash
curl --location 'http://localhost:3000/v1/songs/play' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0YjhhMTA2OS0wZDhlLTRjNzUtOGNmOC00YzA2ZWE3ZWE5YWEiLCJuYW1lIjoiU2FjaGluIEdpcmkiLCJpYXQiOjE1MTYyMzkwMjJ9.bFi8cVnjgF1lZpLNVwdoCCdrTja0rPsDo9MvgVV013Q' \
--data '{
    "songId" : "cd4af257-6a59-4177-b1ac-c4f76aefa7d1"
}'
```

### Public APIs

get top 10 songs

```bash
curl --location 'http://localhost:3000/v1/songs/most-played?limit=10'

[
    {
        "id": "cd4af257-6a59-4177-b1ac-c4f76aefa7d1",
        "createdAt": "2024-11-11T19:55:45.766Z",
        "updatedAt": "2024-11-11T19:55:45.766Z",
        "importId": 434,
        "artists": [
            {
                "id": "18b4ce93-7692-48aa-8ee5-e679fc290b09",
                "role": "MAIN"
            }
        ],
        "title": "Voyage Voyage",
        "totalLikes": 0,
        "totalPlays": 31,
        "dateAdded": "2024-11-11T19:55:45.766Z"
    }
]
```

# Limitations
1. The application is not production ready. It is a proof of concept.
2. The application does not have any authentication but only jwt authorization mechanism.
3. The application does not have any extensive error handling mechanism.
4. The application currently does not have extensive logging. This is due the the fact that I wanted to modify the aggregate, command and query base classes to include logging. This is a work in progress. 
5. I have copied structure from the template repository and modified it to suit my needs. There are few things I wanted to improve. Those improvements have been listed below
6. I also wanted to use Mongodb because the seed data is unstructured. To convert it into structured data, is error prone. e.g. 
The artists names can have multiple artists. if they have characters like & it is hard to distinguish between the artists, because some bands have & in their names. e.g. Simon & Garfunkel. In such cases, I would import the data as is to use other dbs elastic search etc for getting the data out for the top artists etc. 
7. Could not create a really detailed swagger file. 

# Improvements
1. Design the accurate data model for likes, dislikes, unlikes. I considered time series dbs like influxdb for this purpose. It will serve as immutable data store for the likes, dislikes and unlikes. which can be queried for filtering out things by year etc.
2. The top 10 things are maintained in the cache. Though we can persist the redis store, I was also looking to have a robust data model.
3. The aggregate boundaries are currently maintained. Ideally those can be even stricter. They present challenges for the aggregations specially for the sql dbs. My goal was to avoid joins as much as possible. (Hence the use of redis for the top 10 things)
4. There are no unit test cases. I am really shameful for that. This is only due to the time constraints. I will add them for the sample if permitted.
5. I have thought about the ddd and hexagonal principles a lot about arranging the structure. It actually reduced my time to implement the features. I would like to improve the structure further. The biggest thing I would like to improve is use zod schemas in entities. and create dtos from the zod schemas. This will make the validation of the data more robust. I started to feel the pain of doing mappers for the entities and dtos. 
6. I would also redefine the interfaces for Aggregate Roots, Entities, Value Objects, Repositories, Services, Commands, Queries. All these constructs must deal with decoded types (zod schema) instead of primitives. 

e.g. I would define the entity creation as follows:

```typescript

// lib/helpers.ts
import { ZodSchema, z } from 'zod';
import { Decoded } from './zod-types';

export function createEntity<
  TSchema extends ZodSchema,
  TDomainEventSchema extends ZodSchema,
  TCreateInputSchema extends ZodSchema
>(
  entitySchema: TSchema,
  domainEventSchema: TDomainEventSchema,
  createInputSchema: TCreateInputSchema,
) {
  return (
    createEntityLogic: (input: Decoded<TCreateInputSchema>) => Decoded<TSchema>,
    createDomainEventLogic: (state: Decoded<TSchema>) => Decoded<TDomainEventSchema>,
  ) => (createInput: Decoded<TCreateInputSchema>) => {
    // Validate input using Zod schema
    createInputSchema.parse(createInput);

    // Create entity
    const entityState = createEntityLogic(createInput);

    // Validate entity state with Zod schema
    entitySchema.parse(entityState);

    // Create and validate domain event
    const domainEvent = createDomainEventLogic(entityState);
    domainEventSchema.parse(domainEvent);

    return { entity: entityState, domainEvent };
  };
}
```

the entity evolution would be as follows:

```typescript
export function evolveEntity<
  TSchema extends ZodSchema,
  TDomainEventSchema extends ZodSchema,
  TEvolveInputSchema extends ZodSchema
>(
  entitySchema: TSchema,
  domainEventSchema: TDomainEventSchema,
  evolveInputSchema: TEvolveInputSchema,
) {
  return (
    evolveEntityLogic: (
      state: Decoded<TSchema>,
      input: Decoded<TEvolveInputSchema>,
    ) => Decoded<TSchema>,
    createDomainEventLogic: (
      previousState: Decoded<TSchema>,
      newState: Decoded<TSchema>,
      changes: Partial<Decoded<TSchema>>,
    ) => Decoded<TDomainEventSchema>,
  ) => (evolveInput: Decoded<TEvolveInputSchema>, entity: Decoded<TSchema>) => {
    // Validate input using Zod schema
    evolveInputSchema.parse(evolveInput);

    // Apply evolution logic
    const newState = evolveEntityLogic(entity, evolveInput);

    // Validate new state with Zod schema
    entitySchema.parse(newState);

    // Determine the state difference
    const changes = Object.keys(newState).reduce((diff, key) => {
      if (newState[key] !== entity[key]) diff[key] = newState[key];
      return diff;
    }, {} as Partial<Decoded<TSchema>>);

    // Create and validate domain event
    const domainEvent = createDomainEventLogic(entity, newState, changes);
    domainEventSchema.parse(domainEvent);

    return { entity: newState, domainEvent, hasChanges: Object.keys(changes).length > 0 };
  };
}
```

Then Aggregate root would be defined as follows:

```typescript
// lib/aggregate-root.ts
import { AggregateRoot as NestAggregateRoot } from '@nestjs/cqrs';
import { Decoded } from './zod-types';
import { ZodTypeAny } from 'zod';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggerPort } from '../ports/logger.port';

export abstract class AggregateRoot<TSchema extends ZodTypeAny> extends NestAggregateRoot {
  private _state: Decoded<TSchema>;
  private _domainEvents: Decoded<ZodTypeAny>[] = [];  // Typed with `Decoded<ZodTypeAny>`

  constructor(state: Decoded<TSchema>) {
    super();
    this._state = state;
  }

  getState(): Decoded<TSchema> {
    return this._state;
  }

  protected setState(newState: Decoded<TSchema>) {
    this._state = newState;
  }

  protected addEvent<TEvent extends ZodTypeAny>(event: Decoded<TEvent>): void {
    this._domainEvents.push(event);
    this.apply(event); // Optionally apply in-memory event handling with NestJS CQRS
  }

  get domainEvents(): Decoded<ZodTypeAny>[] {
    return this._domainEvents;
  }

  clearEvents(): void {
    this._domainEvents = [];
  }

  async publishEvents(logger: LoggerPort, eventEmitter: EventEmitter2): Promise<void> {
    await Promise.all(
      this.domainEvents.map((event) => {
        logger.debug(`Publishing event: ${event.constructor.name}`);
        return eventEmitter.emitAsync(event.constructor.name, event);
      }),
    );
    this.clearEvents();
  }
}
```

This would make me define states of the aggregate correctly. Also create variants of aggregate roots for the commands and queries. This would also make define domain events correctly.

Every construct should depend of domain schema (zod here) and everything else must be evolved from it. It makes the code more robust and less error prone.

