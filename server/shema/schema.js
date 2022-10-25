// const { projects, clients } = require('../sampleData.js');
const Project = require('../models/Project');
const Client = require('../models/Client');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require('graphql');

//Project type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      },
    },
  }),
});

//client type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

//============================1. CREATING ROOT==========================================================
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // 1) Get all projects from mongodb
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find();
      },
    },
    // 1.1) Get single project from mongodb
    project: {
      type: ProjectType, //created above
      args: { id: { type: GraphQLID } }, //arguments
      resolve(parent, args) {
        //args passed from above
        return Project.findById(args.id);
      },
    },

    // 2) Get all clients from mongodb
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find();
      },
    },

    // 2.1) Get single client from mongodb
    client: {
      type: ClientType, //created above
      args: { id: { type: GraphQLID } }, //arguments
      resolve(parent, args) {
        //args passed from above
        return Client.findById(args.id);
      },
    },
  },
});

//===============================2. MUTATIONS (CRUD operations)============================================
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    //1) Create NEW Client
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        //save new client to mongodb
        const newClient = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return newClient.save();
      },
    },
    //2) Delete a Client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        //delete client from mongodb
        return Client.findByIdAndDelete(args.id);
      },
    },
    // 3) Add a project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
          defaultValue: 'Not Started',
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        //save new project to mongodb
        const newProject = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        return newProject.save();
      },
    },
    // 4) Delete a project
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        //delete client from mongodb
        return Client.findByIdAndRemove(args.id);
      },
    },
    // 5) Update a project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdate',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
        },
      },
      resolve(parent, args) {
        //delete client from mongodb
        return Project.findByIdAndUpdate(args.id, {
          $set: {
            name: args.name,
            description: args.description,
            status: args.status,
          },
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});

//========================================= graphql-iin TOOL deer ingej bichehed......
// {
//   client(id: "1") {
//     id
//     name
//     email
//     phone
//   }
// }

//============iim response irne.....
// {
//   "data": {
//     "client": {
//       "id": "1",
//       "name": "Tony Stark",
//       "email": "ironman@gmail.com",
//       "phone": "343-567-4333"
//     }
//   }
// }

// {
//   clients {
//     id
//     name
//     email
//     phone
//   }
// } gej bichxed {data: {clients: [{}, {}, {}]} geh met bvh data irne.}

//============ graphql-iin TOOL MUTATION hiij mongoDB dr CLIENT collection dr data uusew.============================
// mutation {
//   addClient(name: "Tony Stark", email: "ironman@gmail.com", phone: "99022052" ) {
//     id
//     name
//     email
//     phone
//   }
// }

//============iim response irne.....
// {
//   "data": {
//     "addClient": {
//       "id": "6357cd0a317d16924c3cb7cd",
//       "name": "Tony Stark",
//       "email": "ironman@gmail.com",
//       "phone": "99022052"
//     }
//   }
// }

// graphql-iin TOOL deer ingej bichehed......
// {
//   projects {
//     name
//     id
//     status
//     description
//     client {
//       name
//       email
//     }
//   }
// }

//============iim response irne.....
// {
//   "data": {
//     "projects": [
//       {
//         "name": "Ganzo",
//         "id": "6357d4a40704307b5cc11595",
//         "status": "Not Started",
//         "description": "brand new body",
//         "client": {
//           "name": "Tony Stark",
//           "email": "ironman@gmail.com"
//         }
//       }
//     ]
//   }
// }

//
//  mutation {
//    addProject(name: "Ganzo", description: "brand new body", status: new, clientId: "6357cd0a317d16924c3cb7cb"){
//      name
//      description
//      status
//    }
// }

//===============================================
// # mutation {
// #   addClient(name: "Test", email: "test@test.com", phone: "99022052" ) {
// #     id
// #     name
// #     email
// #     phone
// #   }
// # }

// # mutation {
// #   deleteClient(id:"6357d074907ce3877767cefc") {
// #     name
// #   }
// # }

// # {
// #   clients {
// #     name
// #   }
// # }

// # mutation {
// #   addProject(name: "Ganzo", description: "brand new body", status: new, clientId: "6357cd0a317d16924c3cb7cb"){
// #     name
// #     description
// #     status
// #   }
// # }

// # mutation {
// #   updateProject(id: "6357d4a40704307b5cc11595", description: "newly updated project by Ganzo2", status: completed) {
// #     name
// #     status
// #     description
// #   }
// # }
// # {
// #   projects {
// #     name
// #     id
// #     status
// #     description
// #     client {
// #       name
// #       email
// #     }
// #   }
// # }
