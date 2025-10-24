module.exports.permissionCheck = (member, perms) => {
  if (!perms.length) return true;
  return member.permissions.has(perms);
};