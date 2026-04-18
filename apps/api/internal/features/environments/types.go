package environments

type createEnvironmentBody struct {
	Name    string `json:"name" binding:"required"`
	OwnerId string `json:"owner_id" binding:"required"`
}
