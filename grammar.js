/**
 * @file Fhicl grammar for tree-sitter
 * @author Niam Patel <n@playonverbs.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "fhicl",

  word: $ => $.identifier,

  extras: $ => [
    /\s/,
    // $.comment
  ],

  rules: {
    source_file: $ => repeat1(
      choice(
        $.definition,
        $.table,
        // $.include,
        choice(
          prec(2, $.include),
          prec(1, $.comment),
        )
        // $.comment
      )
    ),

    include: $ => seq(
      preprocessor('include'),
      field('path', $.string_atom),
    ),

    definition: $ => seq(
      $._name,
      ':',
      $._value
    ),

    table: $ => seq(
      '{',
      optional($._table_body),
      '}'
    ),

    _table_body: $ => $._table_items,

    _table_items: $ => choice(
      $._table_item,
      seq(
        $._table_item,
        optional(','),
        $._table_items
      )
    ),

    _table_item: $ => $.definition,

    /// ---

    _value: $ => choice(
      $._atom,
      $.table,
      $.sequence,
    ),

    sequence: $ => seq(
      '[',
      optional($._sequence_items),
      ']'
    ),

    _sequence_items: $ => choice(
      $._sequence_item,
      seq(
        $._sequence_item,
        optional(','),
        $._sequence_items
      )
    ),

    _sequence_item: $ => $._value,

    // ---

    _atom: $ => choice(
      $.number_atom,
      $.string_atom,
      $.nil_atom,
      $.boolean_atom,
    ),

    number_atom: $ => choice(
      $._integer_atom,
      $._decimal_atom
    ),

    _integer_atom: _ => /\d+/,

    _decimal_atom: _ => /\d+\.?\d+/,

    string_atom: _ => choice( // add newline and tab acceptance
      /"(.+)"/, // TODO: add escaped characters
      /'(.+)'/,
      // /(?:[a-zA-Z]\w+)/
    ),

    boolean_atom: _ => choice(
      'true',
      /"true"/,
      'false',
      /"false"/
    ),

    nil_atom: _ => /nil/,

    // ---

    _name: $ => choice(
      $.identifier,
      $.hname
    ),

    hname: $ => seq(
      $._atom,
      choice(
        '.',
        $._bracket_index
      ),
      $._atom
    ),

    _bracket_index: $ => seq(
      '[',
      $._integer_atom,
      ']'
    ),

    identifier: _ => /[a-zA-Z1-9]+/,

    comment: _ => choice(
      seq('//', /(\\+(.|\r?\n)|[^\\\n])*/),
      // '//',
      /#.+/
    ),

    // comment: _ => choice(
    //   /#.+/,
    //   /\/\/.+/
    // )
  }
});

function preprocessor(command) {
  //return new RegExp('#' + command);
  return alias(new RegExp('#[ \t]*' + command), '#' + command);
}
