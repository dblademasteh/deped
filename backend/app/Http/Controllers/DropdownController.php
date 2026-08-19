<?php

namespace App\Http\Controllers;

use App\Models\Dropdown;
use App\Models\DropdownEntry;
use Illuminate\Http\Request;

class DropdownController extends Controller
{
    public function index()
    {
        return response()->json(
            Dropdown::with(['entries' => function ($q) {
                $q->orderBy('sort_order');
            }])->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:dropdowns,slug',
            'description' => 'nullable|string',
        ]);

        $dropdown = Dropdown::create($validated);

        return response()->json($dropdown, 201);
    }

    public function update(Request $request, Dropdown $dropdown)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $dropdown->update($validated);

        return response()->json($dropdown);
    }

    public function destroy(Dropdown $dropdown)
    {
        $dropdown->delete();
        return response()->json(['message' => 'Dropdown deleted.']);
    }

    public function storeEntry(Request $request, Dropdown $dropdown)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'value' => 'required|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['dropdown_id'] = $dropdown->id;
        $validated['sort_order'] = $validated['sort_order'] ?? $dropdown->entries()->count();

        $entry = DropdownEntry::create($validated);

        return response()->json($entry, 201);
    }

    public function updateEntry(Request $request, Dropdown $dropdown, DropdownEntry $entry)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'value' => 'required|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $entry->update($validated);

        return response()->json($entry);
    }

    public function destroyEntry(Dropdown $dropdown, DropdownEntry $entry)
    {
        $entry->delete();
        return response()->json(['message' => 'Entry deleted.']);
    }

    public function reorder(Request $request, Dropdown $dropdown)
    {
        $request->validate([
            'entry_ids' => 'required|array',
            'entry_ids.*' => 'exists:dropdown_entries,id',
        ]);

        foreach ($request->entry_ids as $index => $id) {
            DropdownEntry::where('id', $id)->update(['sort_order' => $index]);
        }

        return response()->json(['message' => 'Order updated.']);
    }

    public function entriesBySlug($slug)
    {
        $dropdown = Dropdown::where('slug', $slug)
            ->with(['entries' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order');
            }])
            ->firstOrFail();

        return response()->json($dropdown->entries);
    }
}
