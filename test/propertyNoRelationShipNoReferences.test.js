const { assert } = require('chai');
const YAML = require('yaml');
const fs = require('fs');
const Property = require('../src/property');

function getTestData(testYamlFile) {
  const loadedFile = fs.readFileSync(testYamlFile, 'UTF-8');
  return YAML.parse(loadedFile)
}

function assertDetail(detail, expectedName, expectedValue) {
  assert.equal(detail.name, expectedName);
  assert.equal(detail.value, expectedValue);
}

function assertPropertyName(property) {
  assert.equal(property.name, 'name');
  assert.equal(property.type, 'string');
  assert.equal(property.required, true);
  assert.equal(property.description, 'the name of the owner');
  assert.equal(property.example, 'John Doe');

  assert.equal(property.details.length, 2);
  assertDetail(property.details[0], 'minLength', '1');
  assertDetail(property.details[1], 'maxLength', '30');
}

function assertPropertyFrom(property) {
  assert.equal(property.name, 'from');
  assert.equal(property.type, 'date');
  assert.equal(property.required, true);
  assert.equal(property.description, 'the date the owner, bought the vehicle');
  assert.equal(property.example, '2018-08-24');

  assert.equal(property.details.length, 1);
  assertDetail(property.details[0], 'pattern', 'yyyy-MM-dd');
}
function assertPropertyTo(property) {
  assert.equal(property.name, 'to');
  assert.equal(property.type, 'date');
  assert.equal(property.required, false);
  assert.equal(property.description, 'the date the owner, sold the vehicle\n');
  assert.equal(property.example, '2019-07-28');

  assert.equal(property.details.length, 1);
  assertDetail(property.details[0], 'pattern', 'yyyy-MM-dd');
}
function assertPropertyAge(property) {
  assert.equal(property.name, 'age');
  assert.equal(property.type, 'integer');
  assert.equal(property.required, true);
  assert.equal(property.description, 'the age of the owner\n\nTODO\nHowto determine age?\n');
  assert.equal(property.example, '23');

  assert.equal(property.details.length, 3);
  assertDetail(property.details[0], 'minimum', '15');
  assertDetail(property.details[1], 'maximum', '120');
  assertDetail(property.details[2], 'multipleOf', '1');
}
function assertPropertyNicknames(property) {
  assert.equal(property.name, 'nicknames');
  assert.equal(property.type, 'array[] of strings');
  assert.equal(property.required, false);
  assert.equal(property.description, 'the nicknames of the owner');
  assert.equal(property.example, undefined);

  assert.equal(property.details.length, 3);
  assertDetail(property.details[0], 'minItems', '1');
  assertDetail(property.details[1], 'maxItems', '5');
  assertDetail(property.details[2], 'uniqueItems', true);
}

function assertPropertyGender(property) {
  assert.equal(property.name, 'gender');
  assert.equal(property.type, 'enum');
  assert.equal(property.required, false);
  assert.equal(property.description, 'the gender of the owner');
  assert.equal(property.example, undefined);

  assert.equal(property.details.length, 2);
  assertDetail(property.details[0], 'enumvalue', 'male');
  assertDetail(property.details[1], 'enumvalue', 'female');
}
function assertPropertyFile1(property) {
  assert.equal(property.name, 'file1');
  assert.equal(property.type, 'string [binary]');
  assert.equal(property.required, false);
  assert.equal(property.description, undefined);
  assert.equal(property.example, undefined);

  assert.equal(property.details.length, 0);
}
function assertPropertyFile2(property) {
  assert.equal(property.name, 'file2');
  assert.equal(property.type, 'string [byte]');
  assert.equal(property.required, false);
  assert.equal(property.description, 'the second file');
  assert.equal(property.example, undefined);

  assert.equal(property.details.length, 0);
}
function assertPropertyShoeSize(property) {
  assert.equal(property.name, 'shoeSize');
  assert.equal(property.type, 'integer');
  assert.equal(property.required, false);
  assert.equal(property.description, undefined);
  assert.equal(property.example, undefined);

  assert.equal(property.details.length, 0);
}
function assertPropertySomeDouble(property) {
  assert.equal(property.name, 'someDouble');
  assert.equal(property.type, 'integer');
  assert.equal(property.required, false);
  assert.equal(property.description, undefined);
  assert.equal(property.example, undefined);

  assert.equal(property.details.length, 1);
  assertDetail(property.details[0], 'format', 'double');
}
function assertPropertyPipe(property) {
  assert.equal(property.name, 'pipe');
  assert.equal(property.type, 'string');
  assert.equal(property.required, false);
  assert.equal(property.description, undefined);
  assert.equal(property.example, undefined);

  assert.equal(property.details.length, 1);
  assertDetail(property.details[0], 'pattern', '^(nl|NL|Nederland)$');
}

describe('properties - parseProperties - no relationships - no references to other files', () => {
  const testData = getTestData('./test/resources/propertyNoRelationShipNoReferences.yaml');

  const { properties } = testData.components.schemas.owner;
  const { required } = testData.components.schemas.owner;
  const verbose = false;

  const arrayUnderTest = Property.parseProperties(properties, required, 'owner',verbose);
  assert.isDefined(arrayUnderTest);
  it('Reponse is array containing sub-arrays of which only first one contains data', () => {
    assert.equal(arrayUnderTest.length, 3);
    assert.equal(arrayUnderTest[0].length, 11);
    assert.equal(arrayUnderTest[1].length, 0);
    assert.equal(arrayUnderTest[2].length, 0);
  });
  it('Check property: name', () => {
    assertPropertyName(arrayUnderTest[0][0]);
  });
  it('Check property: from', () => {
    assertPropertyFrom(arrayUnderTest[0][1]);
  });
  it('Check property: to', () => {
    assertPropertyTo(arrayUnderTest[0][2]);
  });
  it('Check property: age', () => {
    assertPropertyAge(arrayUnderTest[0][3]);
  });
  it('Check property: nicknames', () => {
    assertPropertyNicknames(arrayUnderTest[0][4]);
  });
  it('Check property: gender', () => {
    assertPropertyGender(arrayUnderTest[0][5]);
  });
  it('Check property: file1', () => {
    assertPropertyFile1(arrayUnderTest[0][6]);
  });
  it('Check property: file2', () => {
    assertPropertyFile2(arrayUnderTest[0][7]);
  });
  it('Check property: shoeSize', () => {
    assertPropertyShoeSize(arrayUnderTest[0][8]);
  });
  it('Check property: someDouble', () => {
    assertPropertySomeDouble(arrayUnderTest[0][9]);
  });
  it('Check property: pipe', () => {
    assertPropertyPipe(arrayUnderTest[0][10]);
  });
});
