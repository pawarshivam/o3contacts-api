const config = require('@globals/config');
const Contact = require('@models/contact');

module.exports.deleteMany = async () => {
  if (config.env === 'test') {
    await Contact.deleteMany();
  } else throw new Error('Cannot exeute deleteMany in current environment');
};

module.exports.save = async ({ contact }, { user }) => {
  const contactInstance = new Contact(contact);
  contactInstance.user = user._id;

  await contactInstance.save();

  return {
    contact: contactInstance,
  };
};

module.exports.getAll = async ({}, { user }) => {
  const contactInstances = await Contact.find({
    user: user._id,
  });

  return {
    contacts: contactInstances,
  };
};

module.exports.search = async ({ query }, { user }) => {
  const contactInstances = await Contact.find({
    $test: {
      $search: query,
    },
    user: user._id,
  });

  return {
    contacts: contactInstances,
  };
};

module.exports.delete = async ({}, { user }, { _id }) => {
  const contactInstance = await Contact.findOneAndDelete({
    _id,
    user: user._id,
  });

  return {
    contact: contactInstance,
  };
};
