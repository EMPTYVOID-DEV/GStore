<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle } from '$client/components/ui/card';
    import UploadPopup from '$client/components/UploadPopup.svelte';
    import FileSearch from '$client/components/FileSearch.svelte';
    import FileTable from '$client/components/FileTable.svelte';
    import Button from '$client/components/ui/button/button.svelte';

    export let data: { 
        files?: Array<{ apiKey: string; id: string; name: string; extension: string; tags: string[] }>, 
        tracks?: Record<string, { 
            id: string;
            name: string; 
            path: string; 
            isPublic: boolean; 
            creationDate: string; 
            tags: string[] 
        }>, 
        error?: string 
    };

    export let form

    let { files = [], tracks = {}, error } = data;

    let searchTerm = '';
    let trackedSearchTerm = '';
    $: transformedTracks = Object.values(tracks).map(track => ({
        id: track.id,
        name: track.name,
        extension: track.path.split('.').pop() || '',
        tags: track.tags
    }));

    $: filteredFiles = Array.isArray(files) 
        ? files.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase())) 
        : [];

    $: filteredTracks = transformedTracks.filter(track => track.name.toLowerCase().includes(trackedSearchTerm.toLowerCase()));

    let isModalVisible = false;

    const closeModal = () => {
        isModalVisible = false;
    };
</script>

<Card class="w-full m-4 max-w-6xl mx-auto">
    <CardHeader>
        <CardTitle>Local File Management</CardTitle>
    </CardHeader>
    <CardContent>
        <div class="flex justify-end mb-4 p-6 z-50">
            <Button on:click={() => (isModalVisible = true)}>Upload Local File</Button>
            <UploadPopup
                action="upload_to_local"
                isVisible={isModalVisible} 
                onClose={closeModal}
                {form}
            />
        </div>
        {#if error}
            <p class="text-red-500">{error}</p>
        {:else}
            <FileSearch bind:searchTerm={trackedSearchTerm} />

            <FileTable filteredFiles={filteredTracks} action="local_delete" />
        {/if}
    </CardContent>
</Card>


<Card class="w-full m-4 max-w-6xl mx-auto">
    <CardHeader>
        <CardTitle>Remote File Management</CardTitle>
    </CardHeader>
    <CardContent>
        <div class="flex justify-end mb-4 p-6 z-50">
            <Button on:click={() => (isModalVisible = true)}>Upload Remote File</Button>
            <UploadPopup
                action="upload_to_remote"
                isVisible={isModalVisible} 
                onClose={closeModal}
                {form}
            />
        </div>
        {#if error}
            <p class="text-red-500">{error}</p>
        {:else}
            <FileSearch bind:searchTerm />

            <FileTable {filteredFiles} action="delete" />
        {/if}
    </CardContent>
</Card>
