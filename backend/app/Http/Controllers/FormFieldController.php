<?php

namespace App\Http\Controllers;

use App\Models\FormField;
use Illuminate\Http\Request;

class FormFieldController extends Controller
{
    public function index()
    {
        return response()->json(
            FormField::orderBy('section')
                ->orderBy('sort_order')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'key' => 'required|string|max:255|unique:form_fields,key',
            'type' => 'required|string|in:text,email,date,textarea,searchable_select,number',
            'dropdown_slug' => 'nullable|string|max:255',
            'section' => 'required|string|max:255',
            'placeholder' => 'nullable|string|max:255',
            'required' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'col_span' => 'nullable|integer|min:1|max:4',
        ]);

        $validated['sort_order'] = $validated['sort_order'] ?? FormField::where('section', $validated['section'])->count();

        $field = FormField::create($validated);

        return response()->json($field, 201);
    }

    public function show(FormField $formField)
    {
        return response()->json($formField);
    }

    public function update(Request $request, FormField $formField)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'key' => 'required|string|max:255|unique:form_fields,key,' . $formField->id,
            'type' => 'required|string|in:text,email,date,textarea,searchable_select,number',
            'dropdown_slug' => 'nullable|string|max:255',
            'section' => 'required|string|max:255',
            'placeholder' => 'nullable|string|max:255',
            'required' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'col_span' => 'nullable|integer|min:1|max:4',
        ]);

        $formField->update($validated);

        return response()->json($formField);
    }

    public function destroy(FormField $formField)
    {
        $formField->delete();
        return response()->json(['message' => 'Field deleted.']);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'field_ids' => 'required|array',
            'field_ids.*' => 'exists:form_fields,id',
            'section' => 'required|string',
        ]);

        foreach ($request->field_ids as $index => $id) {
            FormField::where('id', $id)->update([
                'sort_order' => $index,
                'section' => $request->section,
            ]);
        }

        return response()->json(['message' => 'Order updated.']);
    }

    public function activeFields()
    {
        return response()->json(
            FormField::where('is_active', true)
                ->orderBy('section')
                ->orderBy('sort_order')
                ->get()
        );
    }
}
