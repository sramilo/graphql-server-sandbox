# Graphql Server Sandbox

Little project to learn and practice about graphql

## Run Locally

Clone the project

```bash
  git clone https://github.com/sramilo/graphql-server-sandbox.git
```

Go to the project directory

```bash
  cd graphql-server-sandbox
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node index.js
```

Start doing queries at

```bash
  https://localhost:4000
```

## Query example

```graphql
query($name: String!) {
  personCount
  allPersons {
    id
    phone
    address {
      street
      city
    }
  }
  findPerson(name: "Samu") {
    address {
      city
    }
  }
}
```
