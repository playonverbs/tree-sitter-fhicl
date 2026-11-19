package tree_sitter_fhicl_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_fhicl "github.com/tree-sitter/tree-sitter-fhicl/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_fhicl.Language())
	if language == nil {
		t.Errorf("Error loading Fhicl grammar")
	}
}
